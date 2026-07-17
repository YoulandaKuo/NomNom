import { useApp } from '../context/AppContext'

export const LANGUAGES = [
  { code: 'en', label: 'EN' },
  { code: 'zh-Hant', label: '繁體中文' },
]

export const translations = {
  en: {
    'app.loading': 'Loading…',

    'auth.tagline': "Your baby's food adventure tracker",
    'auth.welcomeBack': 'Welcome back 👋',
    'auth.createAccount': 'Create account 🎉',
    'auth.email': 'EMAIL',
    'auth.password': 'PASSWORD',
    'auth.passwordMinPlaceholder': 'Min. 6 characters',
    'auth.pleaseWait': 'Please wait…',
    'auth.signIn': 'Sign in',
    'auth.signUp': 'Sign up',
    'auth.noAccount': "Don't have an account? ",
    'auth.hasAccount': 'Already have an account? ',
    'auth.accountCreated': 'Account created! Check your email to confirm, then sign in.',

    'home.settings': 'Settings',
    'home.logout': 'Log out',
    'home.all': 'ALL',
    'home.foodsSoFar': 'foods so far',
    'home.foodGroups': 'Food groups',
    'home.logoutConfirmTitle': 'Log out?',
    'home.logoutConfirmBody': "You'll need to sign back in to keep tracking.",
    'home.cancel': 'Cancel',

    'category.allFoods': 'All foods',
    'category.foodGroups': 'Food groups',
    'category.all': 'All',
    'category.tried': 'Tried',
    'category.notYet': 'Not yet',
    'category.add': 'Add',
    'category.triedOf': '{{tried}} of {{total}} tried',
    'category.triedOfToGo': '{{tried}} of {{total}} tried · {{toGo}} to go',

    'categoryLabel.Fruits': 'Fruits',
    'categoryLabel.Vegetables': 'Vegetables',
    'categoryLabel.Grains': 'Grains',
    'categoryLabel.Protein': 'Protein',
    'categoryLabel.Dairy': 'Dairy',
    'categoryLabel.Others': 'Others',

    'reactionLabel.loved': 'Loved it',
    'reactionLabel.meh': 'Meh',
    'reactionLabel.neutral': 'Neutral',
    'reactionLabel.tried': 'Tried',
    'reactionLabel.allergic': 'Allergic',
    'reactionLabel.not_tried': 'Not tried yet',

    'foodModal.notYet': 'Not yet',
    'foodModal.triedIt': 'Tried it',
    'foodModal.triedItChecked': '✓ Tried it',
    'foodModal.howDidLike': 'How did {{babyName}} like it?',
    'foodModal.optional': 'optional',
    'foodModal.firstTried': 'FIRST TRIED',
    'foodModal.change': 'Change',
    'foodModal.done': 'Done',
    'foodModal.stillOnList': "{{name}} is still on the list — mark it tried when {{babyName}} takes the first taste.",
    'foodModal.editFood': 'Edit food',
    'foodModal.deleteFood': 'Delete food',
    'foodModal.deleting': 'Deleting…',
    'foodModal.deleteConfirm': 'Delete "{{name}}"? This can\'t be undone.',
    'foodModal.addAFood': 'Add a food',
    'foodModal.foodName': 'FOOD NAME',
    'foodModal.foodNamePlaceholder': 'e.g. Dragon Fruit',
    'foodModal.emoji': 'EMOJI',
    'foodModal.emojiPlaceholder': 'Paste or type',
    'foodModal.category': 'CATEGORY',
    'foodModal.adding': 'Adding…',
    'foodModal.addFoodBtn': 'Add food',
    'foodModal.saving': 'Saving…',
    'foodModal.saveChanges': 'Save changes',
    'foodModal.babyNameFallback': 'your baby',

    'foodCard.tapToLog': 'tap to log',

    'settings.title': 'Settings',
    'settings.babyName': "BABY'S NAME",
    'settings.babyNamePlaceholder': 'e.g. Remi',
    'settings.babyNameHelper': 'We\'ll use this name throughout the app. Leave it blank to just say "your baby".',
    'settings.saved': 'Saved ✓',
    'settings.save': 'Save',
    'settings.language': 'LANGUAGE',
  },
  'zh-Hant': {
    'app.loading': '載入中…',

    'auth.tagline': '寶寶的副食品冒險紀錄',
    'auth.welcomeBack': '歡迎回來 👋',
    'auth.createAccount': '建立帳號 🎉',
    'auth.email': '電子郵件',
    'auth.password': '密碼',
    'auth.passwordMinPlaceholder': '至少 6 個字元',
    'auth.pleaseWait': '請稍候…',
    'auth.signIn': '登入',
    'auth.signUp': '註冊',
    'auth.noAccount': '還沒有帳號嗎？',
    'auth.hasAccount': '已經有帳號了嗎？',
    'auth.accountCreated': '帳號建立成功！請至電子郵件確認後再登入。',

    'home.settings': '設定',
    'home.logout': '登出',
    'home.all': '全部',
    'home.foodsSoFar': '種食物',
    'home.foodGroups': '食物分類',
    'home.logoutConfirmTitle': '要登出嗎？',
    'home.logoutConfirmBody': '登出後需要重新登入才能繼續記錄。',
    'home.cancel': '取消',

    'category.allFoods': '所有食物',
    'category.foodGroups': '食物分類',
    'category.all': '全部',
    'category.tried': '已嘗試',
    'category.notYet': '尚未嘗試',
    'category.add': '新增',
    'category.triedOf': '已嘗試 {{tried}} / {{total}}',
    'category.triedOfToGo': '已嘗試 {{tried}} / {{total}}．還差 {{toGo}} 種',

    'categoryLabel.Fruits': '水果',
    'categoryLabel.Vegetables': '蔬菜',
    'categoryLabel.Grains': '穀類',
    'categoryLabel.Protein': '蛋白質',
    'categoryLabel.Dairy': '乳製品',
    'categoryLabel.Others': '其他',

    'reactionLabel.loved': '好喜歡',
    'reactionLabel.meh': '普普通通',
    'reactionLabel.neutral': '普通',
    'reactionLabel.tried': '已嘗試',
    'reactionLabel.allergic': '過敏',
    'reactionLabel.not_tried': '尚未嘗試',

    'foodModal.notYet': '尚未嘗試',
    'foodModal.triedIt': '嘗試過了',
    'foodModal.triedItChecked': '✓ 嘗試過了',
    'foodModal.howDidLike': '{{babyName}}覺得如何？',
    'foodModal.optional': '非必填',
    'foodModal.firstTried': '第一次嘗試',
    'foodModal.change': '修改',
    'foodModal.done': '完成',
    'foodModal.stillOnList': '{{name}} 還在清單上——等 {{babyName}} 第一次嘗試後再標記。',
    'foodModal.editFood': '編輯食物',
    'foodModal.deleteFood': '刪除食物',
    'foodModal.deleting': '刪除中…',
    'foodModal.deleteConfirm': '確定要刪除「{{name}}」嗎？此動作無法復原。',
    'foodModal.addAFood': '新增食物',
    'foodModal.foodName': '食物名稱',
    'foodModal.foodNamePlaceholder': '例如：火龍果',
    'foodModal.emoji': '表情符號',
    'foodModal.emojiPlaceholder': '貼上或輸入',
    'foodModal.category': '分類',
    'foodModal.adding': '新增中…',
    'foodModal.addFoodBtn': '新增食物',
    'foodModal.saving': '儲存中…',
    'foodModal.saveChanges': '儲存變更',
    'foodModal.babyNameFallback': '寶寶',

    'foodCard.tapToLog': '點一下記錄',

    'settings.title': '設定',
    'settings.babyName': '寶寶的名字',
    'settings.babyNamePlaceholder': '例如：小寶',
    'settings.babyNameHelper': '我們會在整個應用程式中使用這個名字。留空則顯示「寶寶」。',
    'settings.saved': '已儲存 ✓',
    'settings.save': '儲存',
    'settings.language': '語言',
  },
}

export function useT() {
  const { state } = useApp()
  const lang = state.language
  return function t(key, vars) {
    let str = translations[lang]?.[key] ?? translations.en[key] ?? key
    if (vars) {
      for (const [k, v] of Object.entries(vars)) str = str.replaceAll(`{{${k}}}`, v)
    }
    return str
  }
}
