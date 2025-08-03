using FluentValidation;
using FluentValidation.AspNetCore;
using HahnWebApidevza.Application.Features.Products.Commands;
using HahnWebApidevza.Application.Validators;
using HahnWebApidevza.Domain.Interfaces;
using HahnWebApidevza.Infrastructure.Persistence;
using HahnWebApidevza.Infrastructure.Repositories;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);


// Controllers
builder.Services.AddControllers();

// DbContext - Utilisation de la chaîne de connexion dans appsettings.json
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// MediatR - Ajout des handlers depuis l'assembly contenant CreateProductCommand
builder.Services.AddMediatR(typeof(CreateProductCommand).Assembly);

// FluentValidation - Enregistre tous les validateurs dans l'assembly contenant CreateProductCommandValidator
builder.Services.AddValidatorsFromAssemblyContaining<CreateProductCommandValidator>();

// Active la validation automatique via FluentValidation
builder.Services.AddFluentValidationAutoValidation();

// Repository - Injection du repository produit
builder.Services.AddScoped<IProductRepository, ProductRepository>();

// CORS - Autoriser le frontend React (changer l’URL si besoin)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:5173") // <-- Port de ton frontend Vite (ou 3000 si create-react-app)
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});


builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Hahn API",
        Version = "v1"
    });
});

var app = builder.Build();


if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowReactApp");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
