import ExcelJS from "exceljs/dist/exceljs.min.js";
import { and, asc, between, eq } from "drizzle-orm";

function getSafeSheetName(name: string, existingNames: Set<string>): string {
  const safeName = name.replace(/[:\\/?*\[\]]/g, "_").trim().substring(0, 31) || "Arkusz";
  let candidate = safeName;
  let counter = 1;
  while (existingNames.has(candidate.toLowerCase())) {
    const suffix = `_${counter}`;
    candidate = safeName.substring(0, 31 - suffix.length) + suffix;
    counter++;
  }
  existingNames.add(candidate.toLowerCase());
  return candidate;
}

function formatMinutesToText(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0 && minutes === 0) return "0h";
  if (minutes === 0) return `${hours}h`;
  if (hours === 0) return `${minutes}m`;
  return `${hours}h ${minutes}m`;
}

function formatDurationTo15Min(start: Date, end: Date): { formatted: string; roundedMinutes: number } {
  const diffMs = end.getTime() - start.getTime();
  const totalMinutes = Math.round(diffMs / 60000);
  const roundedMinutes = Math.round(totalMinutes / 15) * 15;
  return {
    formatted: formatMinutesToText(roundedMinutes),
    roundedMinutes,
  };
}

export default eventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }

  const query = getQuery(event);
  const yearParam = query.year ? parseInt(query.year as string) : new Date().getFullYear();
  const monthParam = query.month ? parseInt(query.month as string) : new Date().getMonth() + 1;
  const userRole = user.role;
  let userIdParam = query.userId ? parseInt(query.userId as string) : 0;

  // Non-admins can only export their own timesheets
  if (userRole !== "admin") {
    userIdParam = user.id;
  }

  const startDate = new Date(yearParam, monthParam - 1, 1, 0, 0, 0, 0);
  const endDate = new Date(yearParam, monthParam, 0, 23, 59, 59, 999);

  // Fetch users to include
  let usersToExport = await useDrizzle().select().from(tables.users).all();
  if (userIdParam && userIdParam !== 0) {
    usersToExport = usersToExport.filter((u) => u.id === userIdParam);
  }

  if (usersToExport.length === 0 && userIdParam) {
    throw createError({
      statusCode: 404,
      statusMessage: "Nie znaleziono wybranego pracownika",
    });
  }

  // Fetch all timelogs in the date range
  const timelogs = await useDrizzle()
    .select()
    .from(tables.userTimelog)
    .leftJoin(
      tables.projects,
      eq(tables.userTimelog.projectId, tables.projects.id)
    )
    .leftJoin(tables.users, eq(tables.userTimelog.userId, tables.users.id))
    .where(
      and(
        userIdParam && userIdParam !== 0
          ? eq(tables.userTimelog.userId, userIdParam)
          : undefined,
        between(tables.userTimelog.startTime, startDate, endDate)
      )
    )
    .orderBy(asc(tables.userTimelog.startTime))
    .all();

  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Workflow";
  workbook.created = new Date();

  const existingSheetNames = new Set<string>();

  for (const worker of usersToExport) {
    const workerLogs = timelogs.filter(
      (log) => log.user_timelog.userId === worker.id
    );

    const sheetName = getSafeSheetName(
      worker.name || worker.username || `Pracownik_${worker.id}`,
      existingSheetNames
    );

    const worksheet = workbook.addWorksheet(sheetName, {
      views: [{ showGridLines: true }],
    });

    worksheet.columns = [
      { header: "Pracownik", key: "worker", width: 24 },
      { header: "Projekt", key: "project", width: 28 },
      { header: "Dzień miesiąca", key: "date", width: 18 },
      { header: "Liczba godzin", key: "hours", width: 16 },
      { header: "Godzina startu", key: "startTime", width: 16 },
      { header: "Godzina końca", key: "endTime", width: 16 },
    ];

    // Header styling
    const headerRow = worksheet.getRow(1);
    headerRow.height = 26;
    headerRow.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 11 };
    headerRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF1F2937" },
    };
    headerRow.alignment = { vertical: "middle", horizontal: "center" };

    if (workerLogs.length === 0) {
      const emptyRow = worksheet.addRow({
        worker: worker.name || worker.username,
        project: "Brak zalogowanych godzin w wybranym miesiącu",
        date: "-",
        hours: "0h",
        startTime: "-",
        endTime: "-",
      });
      emptyRow.font = { italic: true, color: { argb: "FF6B7280" } };
      emptyRow.height = 22;
      emptyRow.alignment = { vertical: "middle", horizontal: "center" };
      emptyRow.getCell("project").alignment = { vertical: "middle", horizontal: "left" };
    } else {
      let totalWorkerMinutes = 0;

      for (const log of workerLogs) {
        const start = new Date(log.user_timelog.startTime);
        const end = new Date(log.user_timelog.endTime);
        const { formatted: durationFormatted, roundedMinutes } = formatDurationTo15Min(start, end);
        totalWorkerMinutes += roundedMinutes;

        const dayOfWeek = start.getDay(); // 0 is Sunday, 6 is Saturday
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

        const dateStr = `${start.getFullYear()}-${String(
          start.getMonth() + 1
        ).padStart(2, "0")}-${String(start.getDate()).padStart(2, "0")}`;

        const formatHHMM = (d: Date) => {
          return `${String(d.getHours()).padStart(2, "0")}:${String(
            d.getMinutes()
          ).padStart(2, "0")}`;
        };

        const row = worksheet.addRow({
          worker: log.users?.name || worker.name || worker.username,
          project: log.projects?.name || "Brak projektu",
          date: dateStr,
          hours: durationFormatted,
          startTime: formatHHMM(start),
          endTime: formatHHMM(end),
        });

        row.height = 22;
        row.alignment = { vertical: "middle", horizontal: "center" };
        row.getCell("worker").alignment = { vertical: "middle", horizontal: "left" };
        row.getCell("project").alignment = { vertical: "middle", horizontal: "left" };
        row.getCell("hours").alignment = { vertical: "middle", horizontal: "center" };

        row.eachCell((cell) => {
          cell.border = {
            top: { style: "thin", color: { argb: "FFE5E7EB" } },
            left: { style: "thin", color: { argb: "FFE5E7EB" } },
            bottom: { style: "thin", color: { argb: "FFE5E7EB" } },
            right: { style: "thin", color: { argb: "FFE5E7EB" } },
          };

          // Highlight Saturday and Sunday with a distinct amber/yellow fill
          if (isWeekend) {
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "FFFFF3C4" },
            };
          }
        });
      }

      // Summary row
      const summaryRow = worksheet.addRow({
        worker: "SUMA",
        project: "",
        date: "",
        hours: formatMinutesToText(totalWorkerMinutes),
        startTime: "",
        endTime: "",
      });

      summaryRow.height = 24;
      summaryRow.font = { bold: true, size: 11 };
      summaryRow.alignment = { vertical: "middle", horizontal: "center" };
      summaryRow.getCell("worker").alignment = { vertical: "middle", horizontal: "left" };
      summaryRow.getCell("hours").alignment = { vertical: "middle", horizontal: "center" };

      summaryRow.eachCell((cell) => {
        cell.border = {
          top: { style: "thin", color: { argb: "FF374151" } },
          bottom: { style: "double", color: { argb: "FF374151" } },
        };
      });
    }
  }

  const buffer = await workbook.xlsx.writeBuffer();
  const filename = `Raport_czasu_pracy_${yearParam}_${String(monthParam).padStart(
    2,
    "0"
  )}.xlsx`;

  setHeader(
    event,
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  setHeader(event, "Content-Disposition", `attachment; filename="${filename}"`);

  return buffer;
});
