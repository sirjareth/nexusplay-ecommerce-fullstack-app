// Maps exact product names (from DB) to image filenames in /public/images/
const imageMap = {
  'God of War Ragnarök': 'gowr.jpg',
  'Death Stranding': 'ds1.jpg',
  'God of War (2018)': 'gow.jpg',
  'Death Stranding 2': 'ds2.jpg',
  'Outlast 2': 'outl2.jpg',
  'Elden Ring': 'eldenring.jpg',
  'Resident Evil Village': 're8.jpg',
  'Cyberpunk 2077': 'cp.jpg',
  'Red Dead Redemption 2': 'rdr2.jpg',
  'The Last of Us Part I': 'tlou1.jpg',
  'The Last of Us Part II': 'tlou2.jpg',
  "Ghost of Tsushima DIRECTOR'S CUT": 'gotdc.jpg',
}

export function getGameImage(productName) {
  // Try exact match first
  if (imageMap[productName]) return `/images/${imageMap[productName]}`

  // Fallback: partial case-insensitive match
  const lower = productName.toLowerCase()
  for (const [key, file] of Object.entries(imageMap)) {
    if (lower.includes(key.toLowerCase()) || key.toLowerCase().includes(lower)) {
      return `/images/${file}`
    }
  }

  return null // no image found, use fallback icon
}
