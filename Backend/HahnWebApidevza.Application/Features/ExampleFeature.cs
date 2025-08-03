using MediatR;

namespace HahnWebApidevza.Application.Features
{
    public class ExampleFeature : IRequest<string>
    {
        public int Id { get; set; }
    }
}
