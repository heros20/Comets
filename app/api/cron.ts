export default async function handler(req, res) {
  // Ton code à exécuter ici
  console.log("Script lancé à 2h du mat");

  // Réponse pour dire que ça a marché
  res.status(200).json({ message: "OK" });
}
