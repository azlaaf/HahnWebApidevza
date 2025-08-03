using HahnWebApidevza.Application.Features.Products.Commands;
using HahnWebApidevza.Domain.Entities;
using HahnWebApidevza.Domain.Events;   // <-- Ajouté pour l'événement
using HahnWebApidevza.Domain.Interfaces;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace HahnWebApidevza.Application.Features.Products.Handlers
{
    public class UpdateProductHandler : IRequestHandler<UpdateProductCommand>
    {
        private readonly IProductRepository _repository;
        private readonly IMediator _mediator;

        public UpdateProductHandler(IProductRepository repository, IMediator mediator)
        {
            _repository = repository;
            _mediator = mediator;
        }

        public async Task<Unit> Handle(UpdateProductCommand request, CancellationToken cancellationToken)
        {
            var product = await _repository.GetByIdAsync(request.Id);
            if (product == null)
                throw new Exception("Product not found");

            product.Update(request.Name, request.Price);

            await _repository.UpdateAsync(product);

            // Publier l'événement ProductUpdatedEvent après mise à jour
            await _mediator.Publish(new ProductUpdatedEvent(product), cancellationToken);

            return Unit.Value;
        }
    }
}
