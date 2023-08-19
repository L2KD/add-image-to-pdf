var url = 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/examples/learning/helloworld.pdf';


$(function () {
    let l2kdPDFDPI; // Current user dpi
    let l2kdPDFData; // Current pdf loaded
    let l2kdPDFEnableScroll = true;

    let pagePositionArray = [];

    const l2kdPDFDefaultConfigs = {
        scale: 1, // default
        totalPage: 1,
        currentPage: 1,
        pageArray: [],
        signatureArray: [],
        currentSignImageBase64Data: null
    }
    let l2kdPDFConfigs = {...l2kdPDFDefaultConfigs};
    let singnatureElement = null;
    let imageDataAdd = null;
    let signatureAdded = [];
    let signatureInCanvas = [];
    let signatureAddedFiltered = [];
    let kyBenhNhan = 0; // 0: Ký smartca    1: Ký bệnh nhân
    let l2kdPDFPdfData = null;
    let l2kdPDFlistChuKy = [];

    // Loaded via <script> tag, create shortcut to access PDF.js exports.
    var PDFJS = window['pdfjs-dist/build/pdf'];
    // The workerSrc property shall be specified.
    PDFJS.GlobalWorkerOptions.workerSrc = 'pdf.worker.js';

    $("#top-menu-button-upload-pdf").click(function () {
        $("#choose-pdf").click();
    });

    $("#choose-pdf").change(function (event) {
        const file = event.target.files[0];
        console.log(file);
        loadFileToPdf(file);
    });

    function initPdfInfo() {
        $("#top-menu-input-page").val(l2kdPDFConfigs.currentPage);
        $("#top-menu-page-nums-total").val(l2kdPDFConfigs.totalPage);
    }

    function renderPage(pageNumber) {
        const l2kdPDFPdfElement = $("#l2kd-plugin-pdf");
        l2kdPDFPdfElement.children().remove(); // empty element before load pages
        l2kdPDFPdfElement.append('<div id="l2kd-plugin-pdf-viewer-' + pageNumber + '"></div>');
        l2kdPDFData.getPage(pageNumber).then(function (page) {
            const viewport = page.getViewport({scale: l2kdPDFConfigs.scale});
            const defaultViewport = page.getViewport(1);

            // const pdfViewport = page.getViewport(1 / 72 * l2kdPDFDPI);
            const pdfViewport = viewport;
            const l2kdPDFCanvasId = 'l2kd-plugin-canvas-' + pageNumber;
            const l2kdPDFViewerElement = $("#l2kd-plugin-pdf-viewer-" + pageNumber);
            l2kdPDFViewerElement.append('<canvas id="' + l2kdPDFCanvasId + '" class="l2kd-plugin-pdf-viewport"/>');

            const l2kdPDFCanvasElement = document.getElementById(l2kdPDFCanvasId);
            const l2kdPDFContext = l2kdPDFCanvasElement.getContext('2d');
            l2kdPDFCanvasElement.height = pdfViewport.height;
            l2kdPDFCanvasElement.width = pdfViewport.width;

            l2kdPDFViewerElement.css("width", pdfViewport.width);
            l2kdPDFViewerElement.css("box-shadow", "rgba(6, 24, 44, 0.4) 0px 0px 0px 2px, rgba(6, 24, 44, 0.65) 0px 4px 6px -1px, rgba(255, 255, 255, 0.08) 0px 1px 0px inset");
            l2kdPDFViewerElement.addClass("l2kd-plugin-pdf-viewer");

            var l2kdPDFRenderContext = {
                canvasContext: l2kdPDFContext,
                viewport: pdfViewport
            };
            const l2kdPDFRenderTask = page.render(l2kdPDFRenderContext);
            l2kdPDFRenderTask.promise.then(async function () {
                console.log("page " + pageNumber + " rendered");
            });
        });
    }

    async function loadPdf(file) {
        const loadingTask = PDFJS.getDocument(file);
        await loadingTask.promise.then(function (data) {
            l2kdPDFData = data;
            // smartcaV2PDF = data;
            l2kdPDFConfigs.totalPage = data.numPages;
            l2kdPDFConfigs.currentPage = 1;
            // const smartcaV2Element = $('#smartcav2-plugin');
            // smartcaV2Element.css("display", "block");
            //
            initPdfInfo();
            renderPage(2);

            // renderPdfL2KDPlugin(data).then(function () {
            //     console.log('loaded');
            // });
        });
    }

    /**
     * Khởi tạo phần từ pdf để xem
     * @param pdfFile file pdf cần hiển thị
     * @returns {Promise<void>}
     */
    async function renderPdfL2KDPlugin(pdfFile) {
        const l2kdPDFPdfElement = $("#l2kd-plugin-pdf");
        l2kdPDFPdfElement.children().remove(); // empty element before load pages
        if (pagePositionArray.length > 0) {
            pagePositionArray = [];
        }

        const pages = pdfFile.numPages;
        let currentP = 0;
        let temp = 0;
        for (let i = 1; i <= pages; i++) {
        }
        l2kdPDFPdfElement.append('<div style="height: 100px"></div>');
    }

    function getBase64(file) {
        var reader = new FileReader();
        let result;
        reader.readAsDataURL(file);
        reader.onload = function () {
            console.log(reader.result);
            result = reader.result;
        };
        reader.onerror = function (error) {
            console.log('Error: ', error);
        };
        return result;
    }

    function loadFileToPdf(file) {
        //Step 2: Read the file using file reader
        var fileReader = new FileReader();
        fileReader.onload = function () {
            result = new Uint8Array(fileReader.result);
            loadPdf(result);
        };
        //Step 3:Read the file as ArrayBuffer
        fileReader.readAsArrayBuffer(file);
    }

    $("#top-menu-button-first-page").click(function () {
        console.log(l2kdPDFData);
        renderPage(1);
    })
});