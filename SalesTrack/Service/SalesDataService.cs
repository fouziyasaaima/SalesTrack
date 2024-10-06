// Services/SalesDataService.cs
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using System.Collections.Generic;
using SalesTrack.data; // Adjust according to your actual namespace

public class SalesDataService : ISalesDataService
{
    private readonly HttpClient _httpClient;
    private string storeUrl = "master-minded";
    private string accessToken = "ff3e81b6eb93be3a049ad7548759cd6f";
    public SalesDataService(HttpClient httpClient)
    {
        _httpClient = httpClient;
        
    }
        
    public async Task<List<SalesData>> FetchSalesData()
    {
        var requestUrl = $"{storeUrl}/admin/api/2023-01/orders.json"; // Adjust the endpoint as necessary
        //var requestUrl = "https://your-store-name.myshopify.com/admin/api/2023-01/orders.json";
        using var requestMessage = new HttpRequestMessage(HttpMethod.Get, requestUrl);
        requestMessage.Headers.Add("X-Shopify-Access-Token", accessToken);

        var response = await _httpClient.SendAsync(requestMessage);
        if (response.IsSuccessStatusCode)
        {
            var data = await response.Content.ReadFromJsonAsync<ShopifyResponse>();
            return data.Orders.Select(o => new SalesData
            {
                Id = o.Id,
                TotalPrice = decimal.Parse(o.TotalPrice),
                CreatedAt = DateTime.Parse(o.CreatedAt),
                Latitude = o.ShippingAddress.Latitude,  // Assuming you have this field
                Longitude = o.ShippingAddress.Longitude  // Assuming you have this field
            }).ToList();
        }

        return new List<SalesData>();
    }

    public class ShopifyResponse
    {
        public List<Order> Orders { get; set; }
    }
    public class Order
    {
        public string Id { get; set; }
        public string TotalPrice { get; set; }
        public string CreatedAt { get; set; }
        public ShippingAddress ShippingAddress { get; set; }
    }

    public class ShippingAddress
    {
        public string Address1 { get; set; }
        public string City { get; set; }
        public string Province { get; set; }
        public string Country { get; set; }
        public string Zip { get; set; }
        public double? Latitude { get; set; }  // Nullable if the field might not be present
        public double? Longitude { get; set; } // Nullable if the field might not be present
    }

}
