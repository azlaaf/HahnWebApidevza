using MediatR;

namespace HahnWebApidevza.Application.Features.Products.Commands;

public record UpdateProductCommand(Guid Id, string Name, decimal Price) : IRequest;
