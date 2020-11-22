public with sharing class CreditorInfoResponse {
    @AuraEnabled public Integer id;
	@AuraEnabled public String creditorName;
	@AuraEnabled public String firstName;
	@AuraEnabled public String lastName;
	@AuraEnabled public Double minPaymentPercentage;
	@AuraEnabled public Double balance;
	public static List<CreditorInfoResponse> parse(String json) {
		return (List<CreditorInfoResponse>) System.JSON.deserialize(json, List<CreditorInfoResponse>.class);
	}
}
