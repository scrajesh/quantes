class MactabsController < ApplicationController
  # GET /mactabs
  # GET /mactabs.json
  def index
    @mactabs = Mactab.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @mactabs }
    end
  end

  # GET /mactabs/1
  # GET /mactabs/1.json
  def show
    @mactab = Mactab.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @mactab }
    end
  end

  # GET /mactabs/new
  # GET /mactabs/new.json
  def new
    @mactab = Mactab.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @mactab }
    end
  end

  # GET /mactabs/1/edit
  def edit
    @mactab = Mactab.find(params[:id])
  end

  # POST /mactabs
  # POST /mactabs.json
  def create
    @mactab = Mactab.new(params[:mactab])

    respond_to do |format|
      if @mactab.save
        format.html { redirect_to @mactab, notice: 'Mactab was successfully created.' }
        format.json { render json: @mactab, status: :created, location: @mactab }
      else
        format.html { render action: "new" }
        format.json { render json: @mactab.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /mactabs/1
  # PUT /mactabs/1.json
  def update
    @mactab = Mactab.find(params[:id])

    respond_to do |format|
      if @mactab.update_attributes(params[:mactab])
        format.html { redirect_to @mactab, notice: 'Mactab was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: "edit" }
        format.json { render json: @mactab.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /mactabs/1
  # DELETE /mactabs/1.json
  def destroy
    @mactab = Mactab.find(params[:id])
    @mactab.destroy

    respond_to do |format|
      format.html { redirect_to mactabs_url }
      format.json { head :no_content }
    end
  end
end
