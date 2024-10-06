from appium import webdriver
from appium.webdriver.common.appiumby import AppiumBy
import time

# Desired capabilities
desired_caps = {
    'platformName': 'Android',
    'platformVersion': '14.0',  # Cambia a la versión de tu dispositivo
    'deviceName': 'MyDevice',  # Asegúrate de que el nombre del dispositivo es correcto
    'appPackage': 'host.exp.exponent',  # El paquete de Expo Client
    'appActivity': 'host.exp.exponent/.experience.HomeActivity',  # Actividad principal
    'automationName': 'UiAutomator2',
    'autoGrantPermissions': True
}

# Conectar al servidor de Appium
driver = webdriver.Remote('http://localhost:4723/wd/hub', desired_caps)

# Esperar que la app cargue
time.sleep(10)

# Interactuar con los elementos de la app
usuario_input = driver.find_element(AppiumBy.ACCESSIBILITY_ID, 'Usuario')
usuario_input.send_keys('miUsuario')

contraseña_input = driver.find_element(AppiumBy.ACCESSIBILITY_ID, 'Contraseña')
contraseña_input.send_keys('miContraseña')

login_button = driver.find_element(AppiumBy.ACCESSIBILITY_ID, 'Iniciar sesión')
login_button.click()

# Finalizar la sesión
driver.quit()
