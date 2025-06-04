import VerticalLayout from './VerticalLayout.js'

export default () => {

  return (`
    <div class='layout'>
      ${VerticalLayout(120)}
      <div class='content'>
        <div class='content-header'>
          <div class='content-title'> Submit an expense report </div>
        </div>
        <div class="form-newbill-container content-inner">
          <form data-testid="form-new-bill">
            <div class="row">
              <div class="col-md-6">
                <div class="col-half">
                  <label for="expense-type" class="bold-label">Expense type</label>
                  <select required class="form-control blue-border" data-testid="expense-type">
                    <option>Transportation</option>
                    <option>Restaurants and bars</option>
                    <option>Hotel and lodging</option>
                    <option>Online services</option>
                    <option>IT and electronics</option>
                    <option>Equipment and supplies</option>
                    <option>Office supplies</option>
                  </select>
                </div>
                <div class="col-half">
                  <label for="expense-name" class="bold-label">Expense name</label>
                  <input type="text" class="form-control blue-border" data-testid="expense-name" placeholder="Flight Paris London" />
                </div>
                <div class="col-half">
                  <label for="datepicker" class="bold-label">Date</label>
                  <input required type="date" class="form-control blue-border" data-testid="datepicker" />
                </div>
                <div class="col-half">
                  <label for="amount" class="bold-label">Amount (incl. tax)</label>
                  <input required type="number" class="form-control blue-border input-icon input-icon-right" data-testid="amount" placeholder="348"/>
                </div>
                <div class="col-half-row">
                  <div class="flex-col"> 
                    <label for="vat" class="bold-label">VAT</label>
                    <input type="number" class="form-control blue-border" data-testid="vat" placeholder="70" />
                  </div>
                  <div class="flex-col">
                    <label for="pct" class="white-text">%</label>
                    <input required type="number" class="form-control blue-border" data-testid="pct" placeholder="20" />
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="col-half">
                  <label for="commentary" class="bold-label">Comment</label>
                  <textarea class="form-control blue-border" data-testid="commentary" rows="3"></textarea>
                </div>
                <div class="col-half">
                  <label for="file" class="bold-label">Receipt</label>
                  <input required type="file" class="form-control blue-border" data-testid="file" />
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <div class="col-half">
                  <button type="submit" id='btn-send-bill' class="btn btn-primary">Submit</button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  `)
}















































































