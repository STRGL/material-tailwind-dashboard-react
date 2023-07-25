const capitalize = (string) => {
  const parts = string.split("")
  parts[0] = parts[0].toUpperCase()
  return parts.join("")
}

export default capitalize
