export class SEL_SVG {
    ADD_SVGs (SVGs) {
        this.SVGs = Object.assign({}, SVGs);
    }

    SVG_GET (SVG_CODE) {
        return this.SVGs[SVG_CODE]
    }

    ELEMENT_GET_SVG_CODE (e) {
        let OUT = "";

        if (e != undefined) {
            if (e.PICTURE_ID != undefined) {
                return e.PICTURE_ID;
            }

            if (e.id != undefined) {
                return e.id;
            }
        }

        return OUT;
    }

    SVG_PICTURES_SET_ALL (Filter = '.SEL_SVG') {
        let Items = document.querySelectorAll(Filter);
        for (let i of Items) {
            let Current_PICTURE_ID = this.ELEMENT_GET_SVG_CODE(i);

            if (Current_PICTURE_ID > "") {
                let Current_SVG = this.SVG_GET(Current_PICTURE_ID)
                if (Current_SVG != undefined) {
                    i.innerHTML = Current_SVG
                }
            }
        }
    }

    SVG_FILL (e, COLOR_PALETTE) {
        let NEW_PALETTE = this.SVG_COLORS[COLOR_PALETTE];

        for (let c = 0; c < NEW_PALETTE.length; c++) {
            let Current_Color_Class = `.SVG_COLOR_${c}`
            for (let i of e.querySelectorAll(Current_Color_Class)) {
                let CurrentStyle

                switch (i) {
                    case -1: CurrentStyle = 'fill: transparent;'; break;
                    default: CurrentStyle = `fill: ${NEW_PALETTE[c]};`
                }

                i.style = CurrentStyle;
            }
        }
    };

    constructor(Params) {
        //#SVGs = {};
        this.SVGs = {};


        //SVG_COLORS;
        this.SVG_COLORS = Params.SVG_COLORS;

        this.ADD_SVGs(Params.SVG)
    }
}