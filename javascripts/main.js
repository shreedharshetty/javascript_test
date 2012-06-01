require.config({
    baseUrl : "./javascripts",
    paths : {
        "utils/underscore" : "utils/underscore-min",
        "utils/ready" : "utils/doc_ready"
    }
});

require(["utils/doc_events","utils/ajax","utils/selectors","text!templates/list.html", "utils/underscore","utils/doc_ready"], function(events, ajaz, dom,listTpl) {
    var onwardList = dom.get("#tripOnwards li"),
        returnList = dom.get("#tripReturn li");

        ajaz.Get("results.json", function(data){
        var results = JSON.parse(data);
        dom.get("#tripOnwards").innerHTML = _.template(listTpl, results.air_search_result.onward_solutions);
        dom.get("#tripReturn").innerHTML = _.template(listTpl, results.air_search_result.return_solutions);
    });
    
        Doc_Ready.doc_check(function() {
        var filter = dom.get('.pillButton'),
            resultsDiv = dom.get("#display"),
            filterDiv = dom.get('#filter'),
            filterDisplay = false,
            resultsDisplay = true,
            defaultSort = false;

        calculateTotal = function(){
            var selectedLis = dom.get("li.selected"),
                total = 0.00;

            for (var i = 0; i < selectedLis.length; i++) {
                total += parseFloat(selectedLis[i].getElementsByClassName('fare')[0].innerHTML);
            };

            dom.cashRegister(total.toFixed(0),dom.get("#totalfare strong"),2000); 
            dom.get('.totalfare-int').innerHTML = total.toFixed(0);
        },
        toggleSelected = function(){
            dom.removeClass(dom.getAllSiblings(this,"li"), "selected");
            dom.addClass(this, "selected");
            calculateTotal();
        },
        toggleDisplay = function(){
            filterDiv.style.display = (filterDisplay) ? "none" : "block";
            resultsDiv.style.display = (resultsDisplay) ? "none" : "block";
            filterDisplay = !filterDisplay;
            resultsDisplay = !resultsDisplay;
        },
        initPage = function(){
            dom.addClass([onwardList[0],returnList[0]],"selected");
            calculateTotal();
            events.on([onwardList,returnList] ,"click",toggleSelected);
        },
        toggleSort = function(){
            dom.sortList(this.parentNode.parentNode.getElementsByTagName("ul")[0],defaultSort);
            defaultSort = !defaultSort;
            initPage();
        }
        dom.sortList(dom.get("#tripOnwards"),true);
        dom.sortList(dom.get("#tripReturn"),false);

        initPage();

        events.click(filter,toggleDisplay);
        events.on(dom.get('.sorts a') ,"click",toggleSort);
        
    });
});