using System.Net.Http.Json;
using System.Text;

public class RagService
{
    private readonly DbService _db;
    private readonly EmbeddingService _embed;
    private readonly HttpClient _client;

    public RagService(DbService db, EmbeddingService embed)
    {
        _db = db;
        _embed = embed;
        //_client = new HttpClient { BaseAddress = new Uri("http://localhost:11434") };
    }

//     public async Task<string> Ask(string query)
//     {
//         var qEmbed = await _embed.EmbedText(query);
//         var docs = await _db.Search(qEmbed);

//         var context = string.Join("\n\n", docs.Select(d => $"{d.Item1}: {d.Item2}"));

//         var prompt = $@"
// Bạn là trợ lý khóa học.
// Hãy trả lời dựa trên dữ liệu sau:

// {context}

// Câu hỏi: {query}
// ";

//         var payload = new
//         {
//             model = "qwen2.5:1.5b",
//             prompt = prompt,
//             stream = false
//         };

//         var res = await _client.PostAsJsonAsync("/api/generate", payload);
//         var json = await res.Content.ReadAsStringAsync();

//         return JsonDocument.Parse(json)
//             .RootElement.GetProperty("response")
//             .GetString();
//     }
}
