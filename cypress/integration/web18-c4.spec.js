import data from "../fixtures/web18-c4.json";
import "cypress-localstorage-commands";
let newdata = data.filter((ele, index) => index % 2 == 0);
const details = [
  {
    matchNumber: 8,
    teamA: "Samurai",
    teamB: "Titans",
    venue: "Pune",
  },
  {
    matchNumber: 4,
    teamA: "Vikings",
    teamB: "Ninja",
    venue: "Delhi",
  },
];
function FormFill(index) {
  cy.get("#matchNum").clear().type(details[index].matchNumber);
  cy.get("#teamA").select(details[index].teamA);
  cy.get("#teamB").select(details[index].teamB);
  cy.get("#date").type("2020-01-01").trigger("keydown", {
    key: "Enter",
  });
  cy.get("#venue").select(details[index].venue);
}

function modifyUrl(url = "") {
  let split = url.split(".netlify.app");
  return split[0] + ".netlify.app/";
}
// let url = "https://u2c4web18.netlify.app/matches.html";
newdata.forEach((ele) => {
  describe("Unit 2 C4", () => {
    let acc_score = 1;
    let url = modifyUrl(ele.submission_link);
    function checkForm(index, score) {
      cy.get("tbody")
        .children("tr")
        .eq(index)
        .children("td")
        .contains(details[index].matchNumber);
      cy.get("tbody")
        .children("tr")
        .eq(index)
        .children("td")
        .contains(details[index].teamA);
      cy.get("tbody")
        .children("tr")
        .eq(index)
        .children("td")
        .contains(details[index].teamB);
      cy.get("tbody")
        .children("tr")
        .eq(index)
        .children("td")
        .contains(details[index].venue)
        .then(() => {
          acc_score += score;
        });
    }
    beforeEach(() => {
      cy.restoreLocalStorage();
    });
    afterEach(() => {
      cy.saveLocalStorage();
    });

    it("checking schedule local storage length", () => {
      cy.visit(url);
      cy.clearLocalStorage("schedule");
      FormFill(0);
      cy.get("form")
        .submit()
        .should(() => {
          expect(JSON.parse(localStorage.getItem("schedule")).length).to.equal(
            1
          );
        })
        .then(() => {
          acc_score += 1;
        });
    });

    it("going to the matches page and checking DOM Update", () => {
      FormFill(1);
      cy.get("form").submit();
      cy.get("#navbar").children("h1").eq(1).click();
      checkForm(0, 0.5);
      checkForm(1, 0.5);
    });
    it("Checking the Filter Functionality", () => {
      cy.get("#filterVenue").select("Pune");
      checkForm(0, 1.5);
    });

    it("checking favourites local storage length", () => {
      cy.get("tbody")
        .children("tr")
        .eq(0)
        .children("td")
        .eq(5)
        .click()
        .then(() => {
          expect(
            JSON.parse(localStorage.getItem("favouriteMatches")).length
          ).to.equal(1);
        })
        .then(() => {
          acc_score += 1;
        });
    });
    it("going to favorites page and checking if fav contact is displayed", () => {
      cy.restoreLocalStorage();
      cy.get("#navbar").children("h1").eq(2).click();
      checkForm(0, 1.5);
    });
    it("Checking if delete works or not", () => {
      cy.get("tbody")
        .children("tr")
        .eq(0)
        .children("td")
        .eq(5)
        .click()
        .then(() => {
          expect(
            JSON.parse(localStorage.getItem("favouriteMatches")).length
          ).to.equal(0);
        })
        .then(() => {
          acc_score += 1;
        });
      cy.get("tbody")
        .children("tr")
        .should("have.length", 0)
        .then(() => {
          acc_score += 1;
        });
    });
    describe("calc score", () => {
      it("calc score", { retries: 1 }, () => {
        cy.writeFile(
          "w18-scores.txt",
          `\n${ele.username}, ${ele.name} ${ele.submission_link}, ${acc_score}`,
          {
            flag: "a+",
          }
        );
        console.log(acc_score, "acc_score");
      });
    });
  });
});
