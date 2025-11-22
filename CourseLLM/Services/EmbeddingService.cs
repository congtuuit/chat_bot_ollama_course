using System.Net.Http.Json;
using System.Text.Json;

public class EmbeddingService
{
    private readonly HttpClient _client = new() { BaseAddress = new Uri("http://localhost:11434") };

    public async Task<float[]> EmbedText(string text)
    {
        var payload = new
        {
            model = "intfloat/multilingual-e5-base",
            input = text
        };

        var res = await _client.PostAsJsonAsync("/api/embeddings", payload);
        var json = await res.Content.ReadAsStringAsync();

        using var doc = JsonDocument.Parse(json);
        return doc.RootElement.GetProperty("data")[0].GetProperty("embedding")
            .EnumerateArray()
            .Select(x => x.GetSingle())
            .ToArray();
    }
}
