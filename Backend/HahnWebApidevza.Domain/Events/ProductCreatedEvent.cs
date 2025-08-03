using MediatR;
using HahnWebApidevza.Domain.Entities;

namespace HahnWebApidevza.Domain.Events;

public record ProductCreatedEvent(Product Product) : INotification;
