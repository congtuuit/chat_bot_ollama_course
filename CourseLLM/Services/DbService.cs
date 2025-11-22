using Npgsql;

public class DbService
{
    private readonly string _connString = "Host=localhost;Username=aiuser;Password=aistrongpass;Database=lmsdb";

    public DbService()
    {
        using var conn = new NpgsqlConnection(_connString);
        conn.Open();

        using var cmd = new NpgsqlCommand("CREATE EXTENSION IF NOT EXISTS vector;", conn);
        cmd.ExecuteNonQuery();

        using var cmd2 = new NpgsqlCommand(@"
            CREATE TABLE IF NOT EXISTS courses (
                id SERIAL PRIMARY KEY,
                title TEXT,
                description TEXT,
                embedding vector(768)
            );", conn);
        cmd2.ExecuteNonQuery();
    }

    public async Task InsertCourse(string title, string desc, float[] embed)
    {
        using var conn = new NpgsqlConnection(_connString);
        await conn.OpenAsync();

        using var cmd = new NpgsqlCommand(
            "INSERT INTO courses (title, description, embedding) VALUES (@t, @d, @e)", conn);

        cmd.Parameters.AddWithValue("t", title);
        cmd.Parameters.AddWithValue("d", desc);
        cmd.Parameters.AddWithValue("e", embed);

        await cmd.ExecuteNonQueryAsync();
    }

    public async Task<List<(string, string)>> Search(float[] queryEmbedding)
    {
        using var conn = new NpgsqlConnection(_connString);
        await conn.OpenAsync();
        using var cmd = new NpgsqlCommand(@"
            SELECT title, description, embedding <-> @q AS dist
            FROM courses
            ORDER BY dist
            LIMIT 3;", conn);

        cmd.Parameters.AddWithValue("q", queryEmbedding);

        var list = new List<(string, string)>();
        using var reader = await cmd.ExecuteReaderAsync();
        while (await reader.ReadAsync())
            list.Add((reader.GetString(0), reader.GetString(1)));

        return list;
    }
}
