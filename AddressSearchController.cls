//@author: Mohammad Hasib
public class AddressSearchController {
    public static final String apiKey = 'YOUR-API-KEY';
    @AuraEnabled
    public static String getAddressRecommendations(String searchText){
        String result = null;
        try {
            if (searchText != null) {
                String apiUrl = 'https://maps.googleapis.com/maps/api/place/autocomplete/json?input=' + EncodingUtil.urlEncode(searchText, 'UTF-8') + '&key=' + apiKey;
                
                HttpRequest req = new HttpRequest();
                req.setMethod('GET');
                req.setEndpoint(apiUrl);
                
                Http http = new Http();
                HttpResponse res = http.send(req);
                Integer statusCode = res.getStatusCode();
                
                if (statusCode == 200) {
                    result = res.getBody();
                } else {
                    throw new AuraHandledException('Failed to fetch address recommendations. Status code: ' + statusCode);
                }
            }
        } catch (Exception e) {
            System.debug('Error fetching address recommendations: ' + e.getMessage());
            throw new AuraHandledException('Error fetching address recommendations.');
        }
        
        System.debug('Result Found: ' + result);
        return result;
    }
    
    @AuraEnabled
    public static String getAddressDetails(String placeId) {
        String result = null;
        
        try {
            if (placeId != null) {
                String apiUrl = 'https://maps.googleapis.com/maps/api/place/details/json?placeid=' + EncodingUtil.urlEncode(placeId, 'UTF-8') + '&key=' + apiKey;
                
                HttpRequest req = new HttpRequest();
                req.setMethod('GET');
                req.setEndpoint(apiUrl);
                
                Http http = new Http();
                HttpResponse res = http.send(req);
                Integer statusCode = res.getStatusCode();
                
                if (statusCode == 200) {
                    result = res.getBody();
                } else {
                    throw new AuraHandledException('Failed to fetch address details. Status code: ' + statusCode);
                }
            }
        } catch (Exception e) {
            System.debug('Error fetching address details: ' + e.getMessage());
            throw new AuraHandledException('Error fetching address details.');
        }
        
        System.debug('Address Details: ' + result);
        return result;
    }
}
