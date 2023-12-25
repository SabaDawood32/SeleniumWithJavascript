const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');
const { Select } = require('selenium-webdriver');
describe('Login and Book Appointment Test Cases', function () {
    let driver;

    before(async function () {
        this.timeout(15000);
        driver = await new Builder().forBrowser('chrome').build();
    });

    after(async function () {
        await driver.quit();
    });

    it('Test Case 1: Should login with valid credentials and verify login status', async function () {
        this.timeout(15000);
    
        await driver.get('https://katalon-demo-cura.herokuapp.com/profile.php#login');
    
        await driver.findElement(By.id('txt-username')).sendKeys('John Doe');
        await driver.findElement(By.id('txt-password')).sendKeys('ThisIsNotAPassword');
        await driver.findElement(By.id('btn-login')).click();
    
        
        await driver.wait(until.elementLocated(By.xpath('//*[@id="appointment"]/div/div/div/h2')), 10000);
    
       
        const pageTitle = await driver.getTitle();
        assert.strictEqual(pageTitle, 'CURA Healthcare Service');

        await assertElementText(driver, By.xpath('//*[@id="appointment"]/div/div/div/h2'), 'Make Appointment');
    });
    

    it('Test Case 2: book an appointment', async function () {
        this.timeout(15000);


        let dropdown = await driver.findElement(By.id('combo_facility'));
        let select = new Select(dropdown);
        await select.selectByVisibleText('Hongkong CURA Healthcare Center');


        let radioButton = await driver.findElement(By.id('radio_program_medicaid'));
        const isSelected = await radioButton.isSelected();
        if (!isSelected) {
            await radioButton.click();
        }

        await driver.findElement(By.xpath('//*[@id="appointment"]/div/div/form/div[4]/div/div/div/span')).click();
        await driver.findElement(By.xpath('/html/body/div/div[1]/table/thead/tr[2]/th[3]')).click();
        await driver.findElement(By.xpath('//td[@class="day" and text()="24"]')).click();
        
        await driver.findElement(By.id('txt_comment')).sendKeys('Additional comments for the appointment');

        await driver.findElement(By.id('btn-book-appointment')).click();

        await assertElementText(driver, By.xpath('//*[@id="summary"]//h2'), 'Appointment Confirmation');
        await assertElementText(driver, By.xpath('//*[@id="facility"]'), 'Hongkong CURA Healthcare Center');
        await assertElementText(driver, By.xpath('//*[@id="program"]'), 'Medicaid');
    });
    async function assertElementText(driver, locator, expectedText) {
        const element = await driver.findElement(locator);
        const text = await element.getText();
        assert.strictEqual(text, expectedText);
    }
});
