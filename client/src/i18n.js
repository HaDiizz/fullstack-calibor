import i18n from 'i18next'
import { initReactI18next  } from 'react-i18next'
import transEn from './locales/lang/en/trans.json'
import transTh from './locales/lang/th/trans.json'

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: transEn
      },
      th: {
        translation: transTh
      }
    },
    fallbackLng: 'en',
    debug: true,
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: true
    }
  })

export default i18n