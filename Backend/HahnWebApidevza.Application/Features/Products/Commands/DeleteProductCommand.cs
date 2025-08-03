using MediatR;

namespace HahnWebApidevza.Application.Features.Products.Commands;

public record DeleteProductCommand(Guid Id) : IRequest;
