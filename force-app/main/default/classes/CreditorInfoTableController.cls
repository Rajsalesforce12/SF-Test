public with sharing class CreditorInfoTableController {
    @AuraEnabled(cacheable=true)
    public static List<CreditorInfoResponse> getContents() {
        // Instantiate a new http object
        Http h = new Http();
        // Instantiate a new HTTP request
        HttpRequest req = new HttpRequest();
        //set enpoint using Named Credentials.
        req.setEndpoint('callout:CreditorInfo');
        //specify the method to HTTP request
        req.setMethod('GET');
        List<CreditorInfoResponse> responseList = new List<CreditorInfoResponse>();
        try{
            // get response by sending request
            HttpResponse res = h.send(req);
            if(res.getStatusCode()==200){
                responseList = CreditorInfoResponse.parse(res.getBody());
                //update Min Percent values to make it compatible to datatable percent type specification
                for(CreditorInfoResponse ci:responseList){
                    ci.minPaymentPercentage = ci.minPaymentPercentage/100;
                }
                system.debug('responseList-->' + responseList);
            }
        }catch(exception e){
			System.debug('e'+e.getMessage());
		}
        return responseList;
    }   
}