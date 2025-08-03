using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using System.IO;

namespace HahnWebApidevza.Infrastructure.Persistence
{
    public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
    {
        public AppDbContext CreateDbContext(string[] args)
        {
            // Construire la configuration à partir du dossier de l'API
            var configuration = new ConfigurationBuilder()
                .SetBasePath(Path.Combine(Directory.GetCurrentDirectory(), "..", "HahnWebApidevza.Api"))
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                .Build();

            // Récupérer la chaîne de connexion
            var connectionString = configuration.GetConnectionString("DefaultConnection");

            // Configurer les options DbContext avec SQL Server
            var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();
            optionsBuilder.UseSqlServer(connectionString);

            // Retourner une instance de AppDbContext configurée
            return new AppDbContext(optionsBuilder.Options);
        }
    }
}
