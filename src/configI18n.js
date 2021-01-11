import i18n from '@dhis2/d2-i18n'
import moment from 'moment'

const isLangRTL = code => {
    const langs = ['ar', 'fa', 'ur']
    const prefixed = langs.map(c => `${c}-`)

    return (
        langs.includes(code) ||
        prefixed.filter(c => code.startsWith(c)).length > 0
    )
}

export const configI18n = userSettings => {
    const lang = userSettings.keyUiLocale

    if (isLangRTL(lang)) {
        document.body.setAttribute('dir', 'rtl')
    }
    i18n.changeLanguage(lang)
    moment.locale(lang)
}

export const injectTranslationsToD2 = d2 => {
    if (d2) {
        const translations = {
            settings: 'Settings',
            app_search_placeholder: 'Search apps',
            profile: 'Profile',
            account: 'Account',
            help: 'Help',
            log_out: 'Log out',
            about_dhis2: 'About DHIS 2',
            manage_my_apps: 'Manage my apps',
            no_results_found: 'No results found',
            interpretations: 'Interpretations',
            messages: 'Messages',
        }
        const translationKeys = Object.keys(translations)

        translationKeys.forEach(key => {
            translations[key] = i18n.t(translations[key])
        })

        Object.assign(d2.i18n.translations, translations)
    }
}

export default configI18n
