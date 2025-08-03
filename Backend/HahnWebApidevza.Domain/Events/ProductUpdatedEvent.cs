using MediatR;
using HahnWebApidevza.Domain.Entities;

namespace HahnWebApidevza.Domain.Events;

public record ProductUpdatedEvent(Product Product) : INotification;
