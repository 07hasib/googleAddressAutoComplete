import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getAddressRecommendations from '@salesforce/apex/AddressSearchController.getAddressRecommendations';
import getAddressDetails from '@salesforce/apex/AddressSearchController.getAddressDetails';
export default class AddressSearch extends LightningElement {
    @track searchText;
    addressRecommendations;
    @track selectedAdd = '';
    @track selectedAddress = {
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: ''
    };

    handleSearch(event) {
        this.searchText = event.target.value;
        console.log('searchText', this.searchText);
        this.handleFind();
    }

    get hasRecommendations() {
        return this.addressRecommendations !== null && this.addressRecommendations.length;
    }

    handleFind() {
        getAddressRecommendations({ searchText: this.searchText })
            .then(response => {
                response = JSON.parse(response);
                let addressRecommendations = [];
                response.predictions.forEach(prediction => {
                    addressRecommendations.push({
                        main_text: prediction.structured_formatting.main_text,
                        secondary_text: prediction.structured_formatting.secondary_text,
                        place_id: prediction.place_id,
                    });
                });
                this.addressRecommendations = addressRecommendations;
                console.log('response***', response);
            }).catch(error => {
                console.log('error', error);
            });
    }

    handleAddressRecommendationSelect(event) {
         this.searchText = false;
        const placeId = event.currentTarget.dataset.value;
        console.log('Selected place_id:', placeId);

        getAddressDetails({ placeId: placeId })
            .then(response => {
                response = JSON.parse(response);
                const addressComponents = this.parseAddressComponents(response.result.address_components);

                this.selectedAddress = {
                    street: addressComponents.street,
                    city: addressComponents.city,
                    state: addressComponents.state,
                    postalCode: addressComponents.postalCode,
                    country: addressComponents.country
                };

                console.log('Selected Address:', JSON.stringify(this.selectedAddress));
            })
            .catch(error => {
                console.log('Error fetching address details:', error);
                this.showToast('Error', 'Unable to fetch address details', 'error');
            });
    }

    parseAddressComponents(components) {
        const address = {
            street: '',
            city: '',
            state: '',
            postalCode: '',
            country: ''
        };

        components.forEach(component => {
            const types = component.types;

            if (types.includes('street_number')) {
                address.street = component.long_name + ' ' + address.street;
                this.selectedAdd =  address.street;
            }
            if (types.includes('route')) {
                address.street += component.long_name;
            }
            if (types.includes('locality')) {
                address.city = component.long_name;
            }
            if (types.includes('administrative_area_level_1')) {
                address.state = component.long_name;
            }
            if (types.includes('postal_code')) {
                address.postalCode = component.long_name;
            }
            if (types.includes('country')) {
                address.country = component.long_name;
            }
        });

        return address;
    }

    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant
        });
        this.dispatchEvent(event);
    }
}