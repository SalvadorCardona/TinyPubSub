import { clsx } from 'clsx'

interface CVAConfig {
  variants?: Record<string, Record<string, string>>
  defaultVariants?: Record<string, string>
}

export function cva(base: string, config: CVAConfig = {}) {
  return (options?: Record<string, string | undefined> & { className?: string }) => {
    const { variants, defaultVariants } = config
    const classes = [base]
    const resolved = { ...(defaultVariants || {}), ...(options || {}) }

    if (variants) {
      for (const variantName in variants) {
        const value = resolved[variantName]
        if (value && variants[variantName][value]) {
          classes.push(variants[variantName][value])
        }
      }
    }

    if (options?.className) {
      classes.push(options.className)
    }
    return clsx(classes)
  }
}
