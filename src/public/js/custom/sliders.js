function SetSliders(maxPrice) {
    try {

        var maxPrice = document.querySelector("#max_price_input").value;
        
        // 29. Pricing bar Filter like index 7
        var step = 50;
        $(".filter_price").slider({
            from: 0,
            to: +maxPrice + +step,
            step: step,
            smooth: true,
            round: 0,
            dimension: "€",
            skin: "plastic"
        });

        $(".area_filter").slider({
            from: 0,
            to: 10000,
            step: 10,
            smooth: true,
            round: 0,
            dimension: "m<sup>2</sup>",
            skin: "plastic"
        });

        $(".etaj_filter").slider({
            from: 0,
            to: 10,
            step: 1,
            smooth: true,
            round: 0,
            dimension: "",
            skin: "plastic"
        });
    } catch (err) {
        console.log("Sliders not in here", err);
    }

}

//sliders js
SetSliders();
