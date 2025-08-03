using MediatR;
using System;

namespace HahnWebApidevza.Domain.Events;

public record ProductDeletedEvent(Guid ProductId) : INotification;
