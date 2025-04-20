// This file contains type declarations for Material Symbols
declare module 'material-symbols' {
  interface MaterialSymbol {
    name: string
    codepoint: string
    variants: {
      weight?: number[]
      fill?: boolean[]
      grade?: number[]
      optical_size?: number[]
    }
  }

  const MaterialSymbols: {
    symbols: Record<string, MaterialSymbol>
    getSymbol(name: string): MaterialSymbol | undefined
  }
  export default MaterialSymbols
}

// Ensure TypeScript recognizes Material Symbols CSS classes
interface HTMLElement {
  classList: DOMTokenList
}

// Declare global Material Icons
interface Window {
  MaterialIcons: {
    symbols: Record<
      string,
      {
        name: string
        codepoint: string
        variants: string[]
      }
    >
    load(icons: string[]): Promise<void>
  }
}
