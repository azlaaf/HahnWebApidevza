using MediatR;
using HahnWebApidevza.Domain.Entities;

namespace HahnWebApidevza.Application.Features.Products.Queries;

public record GetAllProductsQuery : IRequest<List<Product>>;
