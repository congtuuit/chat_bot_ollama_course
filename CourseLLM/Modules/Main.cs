using System.Net.Http.Json;
using System.Text;

public static class Main
{
    public static void RegisterRoutes(WebApplication app)
    {
        app.MapGet("/", () => "AI LMS Chatbot Ready");

        // Insert sample data
        // app.MapPost("/seed", async (DbService db, EmbeddingService embed) =>
        // {
        //     var samples = new[]
        //     {
        // new { Title="React Cơ bản", Desc="Khóa học ReactJS từ căn bản đến nâng cao." },
        // new { Title="Python ML", Desc="Học Python Machine Learning từ đầu." },
        // new { Title="Lập trình .NET Core", Desc="Khóa học .NET API, EF Core, Clean Architecture." }
        //     };

        //     foreach (var item in samples)
        //     {
        //         var text = $"{item.Title}. {item.Desc}";
        //         var vec = await embed.EmbedText(text);
        //         await db.InsertCourse(item.Title, item.Desc, vec);
        //     }

        //     return "Seeded data.";
        // });

        // // Chat endpoint
        // app.MapPost("/chat", async (ChatRequest req, RagService rag) =>
        // {
        //     var answer = await rag.Ask(req.Query);
        //     return Results.Json(new { answer });
        // });
    }
}

