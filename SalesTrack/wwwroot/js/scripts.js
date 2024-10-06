async function getShopifyUrl() {
    let url = '';
    await Excel.run(async (context) => {
        const sheet = context.workbook.worksheets.getActiveWorksheet();
        const range = sheet.getRange("A1"); // Adjust the cell reference as needed
        range.load("values");

        await context.sync();
        url = range.values[0][0]; // Get the value from the cell
    });
    return url;
}

async function getShopifyToken() {
    let token = '';
    await Excel.run(async (context) => {
        const sheet = context.workbook.worksheets.getActiveWorksheet();
        const range = sheet.getRange("A2"); // Adjust cell reference as needed
        range.load("values");

        await context.sync();
        token = range.values[0][0]; // Get the value from the cell
    });
    return token;
}
async function insertDataIntoExcel(salesData) {
    await Excel.run(async (context) => {
        const sheet = context.workbook.worksheets.getActiveWorksheet();
        const range = sheet.getRange("A1").getResizedRange(salesData.length - 1, 2);
        range.values = salesData.map(sale => [sale.Id, sale.TotalPrice, sale.CreatedAt]);
        await context.sync();
    });
}

async function createDashboard(todaySales, last7DaysSales, last30DaysSales, salesData) {
    await Excel.run(async (context) => {
        const sheet = context.workbook.worksheets.getActiveWorksheet();

        // Today's Sales Chart
        const todaySalesChart = sheet.charts.add(Excel.ChartType.columnClustered, sheet.getRange("A1:B1"), Excel.ChartSeriesBy.auto);
        todaySalesChart.title.text = "Today's Sales";
        todaySalesChart.setData(todaySales.map(sale => [sale.CreatedAt.toLocaleDateString(), sale.TotalPrice]));

        // Last 7 Days Sales Chart
        const last7DaysChart = sheet.charts.add(Excel.ChartType.columnClustered, sheet.getRange("D1:E1"), Excel.ChartSeriesBy.auto);
        last7DaysChart.title.text = "Last 7 Days Sales";
        last7DaysChart.setData(last7DaysSales.map(sale => [sale.CreatedAt.toLocaleDateString(), sale.TotalPrice]));

        // Last 30 Days Sales Chart
        const last30DaysChart = sheet.charts.add(Excel.ChartType.columnClustered, sheet.getRange("G1:H1"), Excel.ChartSeriesBy.auto);
        last30DaysChart.title.text = "Last 30 Days Sales";
        last30DaysChart.setData(last30DaysSales.map(sale => [sale.CreatedAt.toLocaleDateString(), sale.TotalPrice]));

        // Adding Google Map for customer locations
        const mapUrl = await createGoogleMap(salesData);
        const image = sheet.pictures.add(mapUrl, Excel.Range.fromAddress("J1"));
        image.height = 300;
        image.width = 400;

        await context.sync();
    });
}

async function createGoogleMap(salesData) {
    const locations = salesData.map(sale => `${sale.Latitude},${sale.Longitude}`).join('|');
    const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?size=600x300&markers=color:red%7C${locations}&key=AIzaSyAV6D17qGi4x5O0e7TxPYjSYMobX5yLhao`;
    return mapUrl;
}

