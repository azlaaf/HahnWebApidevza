using MediatR;

namespace HahnWebApidevza.Application.Features.Products.Commands;

public record CreateProductCommand(string Name, decimal Price) : IRequest<Guid>;
