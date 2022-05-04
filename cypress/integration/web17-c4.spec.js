// https://chic-kelpie-80cd26.netlify.app/
import data from "../fixtures/web17-c4.json";
import "cypress-localstorage-commands";
let newdata = data.filter((ele, index) => index % 2 == 0);

import "cypress-localstorage-commands";

c4TestCase();

function c4TestCase() {
  newdata.forEach((ele) => {
    describe("c4", () => {
      let acc_score = 0;


      beforeEach(() => {
        cy.restoreLocalStorage();
      });

      afterEach(() => {
        cy.saveLocalStorage();
      });
      let url = ele.submission_link;
      //   urls.forEach((url) => {
      if (url.charAt(url.length - 1) != "/") {
        url = url + "/";
      }

      it(`${url} Check if API call is made or not`, () => {
        let u =
          "https://masai-mock-api.herokuapp.com/news/top-headlines?country=in";

        cy.intercept(u, (req) => {
          req.continue((res) => {
            expect(res.data).to.have.length(1);
          });
        }).as("apiRequest");
        cy.visit(url);
        cy.then(() => {
          acc_score += 1;
        });
      });

      it(`${url} Proper navbar and sidebar should be present`, () => {
        cy.get("#navbar").should("exist");
        cy.get("#sidebar").should("exist");
        cy.get("#navbar").children().should("have.length.at.most", 2);
        cy.get("#navbar").children("button").should("not.exist");

        cy.then(() => {
          acc_score += 1;
        });
      });

      it(`${url} By default top headlines of india should be showing`, () => {
        cy.visit(`${url}index.html`);
        cy.wait(500);
        cy.get("#results").children().should("have.length", 20);

        cy.then(() => {
          acc_score += 1;
        });
      });

      it(`${url} Top headlines by country should be working`, () => {
        cy.visit(`${url}index.html`);
        cy.get("#nz").click();
        cy.wait(500);
        cy.get("#results").children().should("have.length", 20);
        cy.get(".news").should("exist");

        cy.then(() => {
          acc_score += 1;
        });
      });

      it(`${url} Searching should work properly`, () => {
        // Should search on enter not on click
        cy.get("#search_input").type("tesla");
        cy.get("#search_input").type("{enter}");
        cy.wait(500);
        cy.url().should("include", "/search.html");

        cy.then(() => {
          acc_score += 1.5;
        });
      });

      it(`${url} Search page should have same navbar`, () => {
        // Search should work properly
        cy.get("#navbar").should("exist");
        cy.get("#navbar").children().should("have.length.at.most", 2);
        cy.get("#navbar").children("button").should("not.exist");
        cy.get("#search_input").type("tesla");
        cy.get("#search_input").type("{enter}");
        cy.wait(500);
        cy.url().should("include", "/search.html");
        cy.get("#results").children().should("have.length", 20);

        cy.then(() => {
          acc_score += 1.5;
        });
      });

      it(`${url} on clicking it should show detailed news`, () => {
        cy.get("#results").children().first().click();
        cy.wait(500);
        cy.url().should("include", "/news.html");

        cy.then(() => {
          acc_score += 1;
        });
      });

      it(`${url} Navbar should work same here too`, () => {
        cy.get("#navbar").should("exist");
        cy.get("#navbar").children().should("have.length.at.most", 2);
        cy.get("#navbar").children("button").should("not.exist");
        cy.get("#search_input").type("tesla");
        cy.get("#search_input").type("{enter}");
        cy.wait(500);
        cy.url().should("include", "/search.html");
        cy.get("#results").children().should("have.length", 20);

        cy.then(() => {
          acc_score += 1;
        });
      });

      describe("calc score", () => {
        it("calc score", { retries: 1 }, () => {
          cy.writeFile(
            "w17-scores.txt",
            `\n${ele.username}, ${ele.name} ,${ele.submission_link}, ${acc_score}`,
            {
              flag: "a+",
            }
          );
          console.log(acc_score, "acc_score");
        });
      });
      //   });
    });
  });
}
