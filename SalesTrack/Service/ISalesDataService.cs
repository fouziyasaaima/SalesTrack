// Services/SalesDataService.cs
using SalesTrack.data;

public interface ISalesDataService
{
    //Task<List<SalesData>> FetchSalesData(string storeUrl, string accessToken);
    Task<List<SalesData>> FetchSalesData();
}