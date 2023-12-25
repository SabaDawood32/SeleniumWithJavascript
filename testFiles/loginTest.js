const { Builder, By , until } = require('selenium-webdriver');
const assert = require('assert');

describe('Login Test Cases', function () {
    let driver;

    before(async function () {
        this.timeout(15000); 
        driver = await new Builder().forBrowser('chrome').build();
    });

    after(async function () {
        await driver.quit();
    });

    it('Should display error with invalid credentials', async function () {
        this.timeout(15000);
        await driver.get('https://katalon-demo-cura.herokuapp.com/');
        
        await driver.wait(until.elementLocated(By.id('menu-toggle')), 10000);
        await driver.findElement(By.id('menu-toggle')).click();
        await driver.findElement(By.xpath('//*[@id="sidebar-wrapper"]//a[text()="Login"]')).click();
        await driver.findElement(By.id('txt-username')).sendKeys('InvalidUser');
        await driver.findElement(By.id('txt-password')).sendKeys('InvalidPassword');
        await driver.findElement(By.id('btn-login')).click();

        const errorElement = await driver.findElement(By.xpath('//*[@id="login"]//div[1]/p[2]'));
        const errorText = await errorElement.getText();

        assert.strictEqual(errorText, 'Login failed! Please ensure the username and password are valid.');
    });

    it('Should login with valid credentials', async function () {
        this.timeout(15000); 
        await driver.get('https://katalon-demo-cura.herokuapp.com/');
        
        await driver.wait(until.elementLocated(By.id('menu-toggle')), 10000);
        await driver.findElement(By.id('menu-toggle')).click();
        await driver.findElement(By.xpath('//*[@id="sidebar-wrapper"]//a[text()="Login"]')).click();
        await driver.findElement(By.id('txt-username')).sendKeys('John Doe');
        await driver.findElement(By.id('txt-password')).sendKeys('ThisIsAPassword');
        await driver.findElement(By.id('btn-login')).click();

        const pageTitle = await driver.getTitle();
        assert.strictEqual(pageTitle, 'CURA Healthcare Service');
        const headingElement = await driver.findElement(By.xpath('//*[@id="login"]//h2')); 
        const headingText = await headingElement.getText();
        
        assert.strictEqual(headingText, 'Login');
    });
});
