# frozen_string_literal: true

require "time"

module Migrator
  class DateDetector
    def initialize(file)
      @file = file
    end

    def call
      Time.rfc2822(`#{command}`.lines.last)
    end

    private

    def command
      "git log --date=rfc --pretty=format:'%ad' #{@file}"
    end
  end
end
