using HahnWebApidevza.Application.Features.Products.Commands;
using HahnWebApidevza.Domain.Interfaces;
using MediatR;

namespace HahnWebApidevza.Application.Features.Products.Handlers
{
    public class DeleteProductHandler : IRequestHandler<DeleteProductCommand>
    {
        private readonly IProductRepository _repository;

        public DeleteProductHandler(IProductRepository repository)
        {
            _repository = repository;
        }

        public async Task<Unit> Handle(DeleteProductCommand request, CancellationToken cancellationToken)
        {
            var product = await _repository.GetByIdAsync(request.Id);
            if (product == null)
                throw new Exception("Product not found");

            await _repository.DeleteAsync(request.Id);  // <-- passer l'Id ici

            return Unit.Value;
        }
    }
    }
