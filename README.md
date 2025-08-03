# 🛠️ HahnWebApidevza

Application complète de gestion de produits avec :

- ✅ **Backend en .NET 9**
- ✅ **Frontend en React + TypeScript (Vite)**
- ✅ Architecture Clean avec CQRS + EF Core + Validations
- ✅ Connexion à une base de données SQL Server

---

## 🚀 Lancer le projet localement

### 📦 Prérequis

- [.NET 9 SDK](https://dotnet.microsoft.com/en-us/download)
- SQL Server (local ou distant)

---

### 🧰 Clonage du projet

```bash
git clone https://github.com/azlaaf/HahnWebApidevza.git
cd HahnWebApidevza

🗃️ Configuration de la base de données

    Crée une base de données vide dans SQL Server (ex : Hahnbd).

CREATE DATABASE Hahnbd;

    Ouvre HahnWebApidevza.Api/appsettings.json et configure ta chaîne de connexion :

"ConnectionStrings": {
  "DefaultConnection": "Server=DESKTOP-OJMMIB4\\MSSQLSERVER01;uid=sa;pwd=test;Initial Catalog=Hahnbd;TrustServerCertificate=True"
}

    🔁 Adapte Server, uid, pwd, et Initial Catalog selon ton environnement SQL Server.

🧱 Migration et initialisation de la base

Dans le dossier du projet API :

cd HahnWebApidevza.Api
dotnet build
dotnet ef database update

    ✅ Cela applique la migration et crée les tables dans ta base.

🟢 Lancer le Backend (.NET 9 API)

Toujours dans HahnWebApidevza.Api :

dotnet run

    L’API tourne par défaut sur : http://localhost:5069/api/Product

🖥️ Lancer le Frontend React

Dans le dossier HahnWebApidevza.Frontend :

cd ../HahnWebApidevza.Frontend
npm install
npm run dev

    L'application est accessible ici : http://localhost:5173

🔄 Endpoints API
Méthode	Endpoint	Action
GET	/api/Product	Récupérer tous les produits
POST	/api/Product	Ajouter un produit
PUT	/api/Product/{id}	Modifier un produit
DELETE	/api/Product/{id}	Supprimer un produit
🧪 Structure du projet

HahnWebApidevza/
├── HahnWebApidevza.Api/           # Projet .NET 9 (API)
│   ├── Controllers/
│   ├── Application/
│   ├── Domain/
│   └── Infrastructure/
├── HahnWebApidevza.Frontend/      # Projet React (Vite)
│   └── src/App.tsx
├── README.md
└── ...
