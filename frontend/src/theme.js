import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react'

const customConfig = defineConfig({
  theme: {
    tokens: {
      colors: {
        // Custom theme colors
        orange: {
          50: { value: '#FFF5EB' },
          100: { value: '#FFE7CC' },
          200: { value: '#FFD9AD' },
          300: { value: '#FFCB8E' },
          400: { value: '#F5A857' },
          500: { value: '#E68B2F' },
          600: { value: '#D07A26' },
          700: { value: '#B86A21' },
          800: { value: '#9F5A1C' },
          900: { value: '#864B17' },
        },
        red: {
          50: { value: '#FFEBEB' },
          100: { value: '#FFCCCC' },
          200: { value: '#FF9999' },
          300: { value: '#FF6666' },
          400: { value: '#EE5555' },
          500: { value: '#D84343' },
          600: { value: '#C23838' },
          700: { value: '#AB2E2E' },
          800: { value: '#952424' },
          900: { value: '#7F1A1A' },
        },
        yellow: {
          50: { value: '#FFFCF5' },
          100: { value: '#FFF6E0' },
          200: { value: '#FFEEC2' },
          300: { value: '#F7E09F' },
          400: { value: '#F1D276' },
          500: { value: '#EBC44F' },
          600: { value: '#D4AF42' },
          700: { value: '#BD9A36' },
          800: { value: '#A6852A' },
          900: { value: '#8F701E' },
        },
        cream: {
          50: { value: '#FFF8F1' },
          100: { value: '#FFF3E8' },
          200: { value: '#FFEEDF' },
          300: { value: '#FFE9D6' },
          400: { value: '#FFE4CD' },
        },
        gray: {
          50: { value: '#F7F7F7' },
          100: { value: '#E1E1E1' },
          200: { value: '#CFCFCF' },
          300: { value: '#B1B1B1' },
          400: { value: '#9E9E9E' },
          500: { value: '#7E7E7E' },
          600: { value: '#626262' },
          700: { value: '#515151' },
          800: { value: '#3B3B3B' },
          900: { value: '#2E2E2E' },
        },
      },
    },
  },
})

export const system = createSystem(defaultConfig, customConfig)
