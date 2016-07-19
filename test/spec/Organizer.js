describe("Login ORGANIZER", function() {
    it("should login ORGANIZER and get csrfToken", function() {
        checkSession();
        csrfToken = getCSRFtoken();
        expect(csrfToken).toBe("unsafe");
        login("ORGANIZER", password, csrfToken);
        csrfToken = getCSRFtoken();
    });
});

describe("Create event", function() {
    it("should create event", function() {
        var xhr = createEvent("München");
        expect(xhr.status).toBe(201);
        expect(xhr.statusText).toBe("Created");
        xhr = createEvent("Bern");
        expect(xhr.status).toBe(201);
        expect(xhr.statusText).toBe("Created");
    });
});

describe("Read event and change MaxParticipants", function() {
    it("should return the created event, change the MaxParticipants and check the change", function() {
        var xhr = prepareRequest("GET", "/com/sap/sapmentors/sitreg/odataorganizer/service.xsodata/Events");
        xhr.send();
        expect(xhr.status).toBe(200);
        expect(xhr.statusText).toBe("OK");
        var body = xhr.responseText ? JSON.parse(xhr.responseText) : "";
        expect(body.d.results[0].Location).toBe("München");
        // Change MaxParticipants
        var uri = body.d.results[0].__metadata.uri;
        xhr = prepareRequest("PATCH", uri);
        var change = {
            "MaxParticipants": 81
        };
        xhr.send(JSON.stringify(change));
        expect(xhr.status).toBe(204);
        // Check MaxParticipants
        xhr = prepareRequest("GET", uri);
        xhr.send();
        body = xhr.responseText ? JSON.parse(xhr.responseText) : "";
        expect(body.d.MaxParticipants).toBe(81);
        eventID = body.d.ID;
    });
});

describe("Create COORGANIZER", function() {
    it("should create COORGANIZER", function() {
        var create = {
            "EventID": eventID,
            "UserName": "COORGANIZER",
            "Active": "Y"
        };
        var xhr = prepareRequest("POST", "/com/sap/sapmentors/sitreg/odataorganizer/service.xsodata/CoOrganizers");
        xhr.send(JSON.stringify(create));
        expect(xhr.status).toBe(201);
        expect(xhr.statusText).toBe("Created");
    });
});

describe("Logout ORGANIZER", function() {
    it("should logout ORGANIZER", function() {
        logout(csrfToken);
        checkSession();
    });
});
