const moment = require('moment');

function calculateTotalTarget(startDate, endDate, totalAnnualTarget) {
    const start = moment(startDate);
    const end = moment(endDate);
    const result = {
        totalTarget: totalAnnualTarget,
        months: {}
    };

    let totalValidDays = 0; // Track total valid working days across the entire range

    // Iterate through each month in the date range
    while (start.isBefore(end) || start.isSame(end, 'month')) {
        const monthStart = start.clone().startOf('month');
        const monthEnd = start.clone().endOf('month');
        let workingDays = 0; // Count of working days excluding Fridays

        // Count working days excluding Fridays
        for (let day = monthStart.clone(); day.isBefore(monthEnd) || day.isSame(monthEnd, 'day'); day.add(1, 'days')) {
            if (day.day() !== 5) { // 5 is Friday
                workingDays++;
            }
        }

        // Update total valid working days
        totalValidDays += workingDays;

        // Calculate monthly target if there are valid working days
        if (workingDays > 0) {
            const monthlyTarget = (totalAnnualTarget / totalValidDays) * workingDays;
            result.months[start.format('YYYY-MM')] = {
                daysExcludingFriday: monthEnd.diff(monthStart, 'days') + 1 - (monthEnd.diff(monthStart, 'days') + 1) / 7,
                daysWorkedExcludingFriday: workingDays,
                monthlyTarget: parseFloat(monthlyTarget.toFixed(2)) // rounding to 2 decimal places
            };
        }

        // Move to the next month
        start.add(1, 'months');
    }

    return result;
}

// Example usage
const result = calculateTotalTarget('2024-01-01', '2024-03-31', 5220);
console.log(result);