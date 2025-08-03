using MediatR;
using HahnWebApidevza.Domain.Entities;
using HahnWebApidevza.Domain.Interfaces;
using HahnWebApidevza.Application.Features.Products.Queries;

namespace HahnWebApidevza.Application.Features.Products.Handlers;

public class GetAllProductsHandler : IRequestHandler<GetAllProductsQuery, List<Product>>
{
    private readonly IProductRepository _repo;

    public GetAllProductsHandler(IProductRepository repo)
    {
        _repo = repo;
    }

    public async Task<List<Product>> Handle(GetAllProductsQuery request, CancellationToken cancellationToken)
    {
        return await _repo.GetAllAsync();
    }
}
