using HahnWebApidevza.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HahnWebApidevza.Infrastructure.Repositories
{
    public class ExampleRepository
    {
        public Task<IEnumerable<ExampleEntity>> GetAllAsync()
        {
            // TODO: implémenter accès base de données
            return Task.FromResult<IEnumerable<ExampleEntity>>(new List<ExampleEntity>());
        }
    }
}
