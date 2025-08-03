using MediatR;
using HahnWebApidevza.Domain.Entities;
using HahnWebApidevza.Domain.Events;
using HahnWebApidevza.Domain.Interfaces;
using HahnWebApidevza.Application.Features.Products.Commands;

namespace HahnWebApidevza.Application.Features.Products.Handlers
{
    public class CreateProductHandler : IRequestHandler<CreateProductCommand, Guid>
    {
        private readonly IProductRepository _repo;
        private readonly IMediator _mediator;

        public CreateProductHandler(IProductRepository repo, IMediator mediator)
        {
            _repo = repo;
            _mediator = mediator;
        }

        public async Task<Guid> Handle(CreateProductCommand request, CancellationToken cancellationToken)
        {
            var product = new Product(request.Name, request.Price);
            await _repo.AddAsync(product);
            await _mediator.Publish(new ProductCreatedEvent(product), cancellationToken);
            return product.Id;
        }
    }
}
