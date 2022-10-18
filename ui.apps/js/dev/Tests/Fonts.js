(() => {
    if (!window.parent.window.test) return;
    // Disable console log functionality
    window.console.log = () => {};
    // Start test
    const data = window.parent.window.test.results;
    let styles = data[0];
    let weights = data[1];
    $('body *').each((index, element) => {
        let family = window.getComputedStyle(element, null).getPropertyValue('font-family');
        if (family.indexOf(window.parent.window.test.params.family) < 0) return;
        let style = window.getComputedStyle(element, null).getPropertyValue('font-style');
        if (!styles.includes(style)) styles.push(style);
        let weight = window.getComputedStyle(element, null).getPropertyValue('font-weight');
        if (!weights.includes(weight)) weights.push(weight);
    });
    // Notify automated test script
    window.parent.window.test.loading = false;
    window.parent.window.test.results = [styles, weights];
})();