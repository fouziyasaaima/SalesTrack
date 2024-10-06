namespace SalesTrack.data
{
    public class SalesData
    {
            public string Id { get; set; }
            public decimal TotalPrice { get; set; }
            public DateTime CreatedAt { get; set; }
            public double? Latitude { get; set; } // Add latitude
            public double? Longitude { get; set; } // Add longitude      

    }
}
